import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-3">关于我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">平台介绍</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">用户指南</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">使用帮助</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">常见问题</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">法律条款</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">服务协议</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">隐私政策</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">客服热线</h4>
            <p className="text-sm text-muted-foreground">工作时间：9:00 - 22:00</p>
            <p className="text-sm font-medium mt-1">400-123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 陪玩平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}